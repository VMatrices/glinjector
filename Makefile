include $(TOPDIR)/rules.mk

PKG_NAME:=glinjector
PKG_VERSION:=2.2
PKG_RELEASE:=1
PKG_LICENSE:=MIT
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

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	mkdir -p $(PKG_CACHE_DIR)

	cp -r ./views/src $(PKG_BUILD_DIR)
	cp ./views/package.json $(PKG_BUILD_DIR)
	cp ./views/vite.config.js $(PKG_BUILD_DIR)

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
	npm --prefix $(PKG_BUILD_DIR) run build
endef

define Package/$(PKG_NAME)/install	
	$(CP) ./files/root/* $(1)

	$(INSTALL_DIR) $(1)/usr/share/oui/menu.d/
	$(CP) ./files/menu.json $(1)/usr/share/oui/menu.d/$(PKG_NAME).json

	$(INSTALL_DIR) $(1)/www/views
	$(CP) $(PKG_BUILD_DIR)/dist/app.common.js.gz $(1)/www/views/$(GL_SDK_PREFIX)-$(PKG_NAME).common.js.gz

	$(INSTALL_DIR) $(1)/www/i18n
	@$(foreach file, $(wildcard ./views/i18n/*.json), cp $(file) $(1)/www/i18n/$(GL_SDK_PREFIX)-$(PKG_NAME).$(notdir $(file));)
endef

# define Package/$(PKG_NAME)/conffiles
# 	/etc/config/glinjector
# endef
 
define Package/$(PKG_NAME)/postinst
	#!/bin/sh
	if [ -z "$${IPKG_INSTROOT}" ]; then
		echo hello
	fi
	exit 0
endef

define Package/$(PKG_NAME)/prerm
	#!/bin/sh
	if [ -z "$${IPKG_INSTROOT}" ]; then
		echo bye
		#cp /rom/www/gl_home.html /www/
	fi
	exit 0
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
 