include $(TOPDIR)/rules.mk

PKG_NAME:=glinjector
PKG_VERSION:=3.0.7
PKG_RELEASE:=8
PKG_LICENSE:=GPL-3.0
PKG_MAINTAINER:=VMatrices <vmatrices@outlook.com>

PKG_BUILD_DIR:= $(BUILD_DIR)/$(PKG_NAME)
PKG_CACHE_DIR:= /tmp/.pkg/$(PKG_NAME)
NPM_REGISTER:=https://r.cnpmjs.org
GL_SDK_PREFIX:=gl-sdk4-ui

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
	CATEGORY:=Utilitis
	TITLE:=GlInet UI Injector
	PKGARCH:=all
endef

define Package/$(PKG_NAME)/conffiles
/www/upload
/etc/config/$(PKG_NAME)
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	mkdir -p $(PKG_CACHE_DIR)

	cp -r ./views/src $(PKG_BUILD_DIR)
	cp ./views/package.json $(PKG_BUILD_DIR)
	cp ./views/vite.config.js $(PKG_BUILD_DIR)
	
	cp -r ./views/src_core $(PKG_BUILD_DIR)
	cp ./views/vite.config_core.js $(PKG_BUILD_DIR)

	@if ! diff -wB ./views/package.json $(PKG_CACHE_DIR)/package.json > /dev/null; then \
		cp ./views/package.json $(PKG_CACHE_DIR); \
		if ! npm --registr $(NPM_REGISTER) --prefix $(PKG_CACHE_DIR) install --force; then \
			rm -f $(PKG_CACHE_DIR)/package.json;  \
			exit 1; \
		fi \
	fi

	ln -s $(PKG_CACHE_DIR)/node_modules $(PKG_BUILD_DIR)/node_modules
	ln -s $(PKG_CACHE_DIR)/package-lock.json $(PKG_BUILD_DIR)/package-lock.json
endef

define Build/Compile
	npm --prefix $(PKG_BUILD_DIR) run build:view
	npm --prefix $(PKG_BUILD_DIR) run build:core
endef

define Package/$(PKG_NAME)/install
	if [ -d ./files/root ]; then \
		$(CP) ./files/root/* $(1)/; \
	fi

	if [ -f ./files/config.conf ]; then \
		$(INSTALL_DIR) $(1)/etc/config/; \
		$(INSTALL_CONF) ./files/config.conf $(1)/etc/config/$(PKG_NAME); \
	fi

	if [ -f ./files/menu.json ]; then \
		$(INSTALL_DIR) $(1)/usr/share/oui/menu.d/; \
		$(INSTALL_CONF) ./files/menu.json $(1)/usr/share/oui/menu.d/$(PKG_NAME).json; \
	fi

	if [ -f ./files/upload.path ]; then \
		$(INSTALL_DIR) $(1)/usr/share/gl-upload.d/; \
		$(INSTALL_CONF) ./files/upload.path $(1)/usr/share/gl-upload.d/$(PKG_NAME); \
	fi

	if [ -f ./files/rpc.lua ]; then \
		$(INSTALL_DIR) $(1)/usr/lib/oui-httpd/rpc/; \
		$(INSTALL_DATA) ./files/rpc.lua $(1)/usr/lib/oui-httpd/rpc/$(PKG_NAME); \
	fi

	if [ -f ./files/validator.lua ]; then \
		$(INSTALL_DIR) $(1)/usr/share/gl-validator.d/; \
		$(INSTALL_DATA) ./files/validator.lua $(1)/usr/share/gl-validator.d/$(PKG_NAME).lua; \
	fi

	$(INSTALL_DIR) $(1)/www/i18n/
	@$(foreach file, $(wildcard ./views/i18n/*.json), cp $(file) $(1)/www/i18n/$(GL_SDK_PREFIX)-$(PKG_NAME).$(notdir $(file));)

	$(INSTALL_DIR) $(1)/www/views/
	$(CP) $(PKG_BUILD_DIR)/dist/app.common.js.gz $(1)/www/views/$(GL_SDK_PREFIX)-$(PKG_NAME).common.js.gz

	$(INSTALL_DIR) $(1)/etc/$(PKG_NAME)/
	$(CP) $(PKG_BUILD_DIR)/dist/core.js $(1)/etc/$(PKG_NAME)/

	$(INSTALL_DIR) $(1)/www/upload/
endef

define Package/$(PKG_NAME)/postinst
#!/bin/sh
if [ -z "$${IPKG_INSTROOT}" ]; then
	if grep -qE "[1-4]\.[0-6]\..+" /etc/glversion; then
		echo
		echo 'Your firmware version is lower than 4.7.0, please try a lower version'
		echo '您的固件版本低于4.7.0，请尝试较低版本的插件'
		echo
		exit 1
	fi
	sed -i '/cgi-bin/,/}/{/X-Frame-Options/d}' /etc/nginx/conf.d/gl.conf
	nginx -s reload 2> /dev/null
	echo
	echo 'Please go to "System > Customization" and click the Apply button after installation'
	echo '安装后请进入“系统 > 个性化”点击应用按钮'
	echo
fi
exit 0
endef

define Package/$(PKG_NAME)/prerm
#!/bin/sh
if [ -z "$${IPKG_INSTROOT}" ]; then
	rm -f /www/js/$(PKG_NAME)-*
	cp -f /rom/www/gl_home.html /www/
	cp -f /rom/etc/nginx/conf.d/gl.conf /etc/nginx/conf.d/
	nginx -s reload 2> /dev/null
fi
exit 0
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
 