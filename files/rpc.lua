local uci = require "uci"

local plugin_name = "glinjector"
local gl_home_path = "/www/gl_home.html"

function read_file(path)
    local file = io.open(path, "r");
    local content = file:read("*a")
    file:close()
    return content
end

return {
    get_config = function()
        local c = uci.cursor()
        return {
            json = c:get(plugin_name, "config", "json")
        }
    end,

    set_config = function(params)
        local c = uci.cursor()
        c:set(plugin_name, "config", "json", params.json)
        c:commit(plugin_name)

        os.execute("rm -f /www/js/" .. plugin_name .. "-*");
        local js_path = "/js/" .. plugin_name .. "-" .. math.random(10000000, 99009999) .. ".js"

        local js_code = string.gsub(read_file("/etc/" .. plugin_name .. "/core.js"), 'GL_UI_CONFIG', params.json)
        local js_file = io.open("/www" .. js_path, "w")
        js_file:write(js_code)
        js_file:close()

        local html_code = string.gsub(read_file("/rom" .. gl_home_path), '<script.+app', '<script src="' .. js_path .. '"></script>%0')
        local html_file = io.open(gl_home_path, "w")
        html_file:write(html_code)
        html_file:close()
    end,

    upload_image = function(param)
        local path = "/upload/" .. param.prefix .. "_" .. math.random(1000, 9999) .. "." .. param.ext
        os.execute("rm -f /www/upload/" .. param.prefix .. "_*");
        os.execute("mv -f /tmp/glinjector_upload /www" .. path);
        return {
            path = path
        }
    end
}
