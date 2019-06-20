SHELL = /bin/sh
.SUFFIXES:
.PHONY: all release debug clean distclean check test deploy setup
NPM = pnpm
NPX = pnpx
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

release: | setup check
	$(NPM) run build

debug: setup
	$(NPM) run debug

clean:
	-$(RMRF) dist

distclean: clean
	-$(RMRF) node_modules

check: setup
	$(NPM) run check

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
