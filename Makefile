SHELL = /bin/sh
.SUFFIXES:
.PHONY: all release clean distclean check test deploy setup
NPM = npm
NPX = npx
RM = rm -f
RMRF = rm -rf
touch = touch $(1)
FORCE_DEPLOY =

ifeq ($(OS),Windows_NT)
	SHELL = cmd
	RM = del /Q
	RMRF = rmdir /S /Q
	touch = type nul > $(1)
endif

all: release

release: setup
	$(NPM) run build

clean:
	-$(RMRF) dist

distclean: clean
	-$(RMRF) node_modules

check:
	$(NPX) eslint --ext .js,.jsx,.ts,.tsx src
test:
	$(NPM) test

deploy:
ifeq ($(CI)$(FORCE_DEPLOY),)
	@echo If you want to deploy, should set variable "FORCE_DEPLOY=true"
	exit 1
endif
	$(MAKE) clean
	$(MAKE) release
	$(NPX) gh-pages --dist dist

setup: node_modules/setup-dummy

node_modules/setup-dummy: package.json
	$(NPM) install
	$(call touch,node_modules/setup-dummy)
