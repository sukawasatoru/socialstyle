SHELL = /bin/sh
.SUFFIXES:
NPM = npm
RMRF = rm -rf
touch = touch $(1)

ifeq ($(OS),Windows_NT)
	SHELL = cmd
	RMRF = rmdir /S /Q
	touch = type nul > $(1)
endif

.PHONY: all
all: release

.PHONY: release
release: setup
	$(NPM) run build

.PHONY: clean
clean:
	-$(RMRF) dist
	-$(RMRF) out

.PHONY: distclean
distclean: clean
	-$(RMRF) node_modules

.PHONY: check
check: test

.PHONY: test
test: setup
# 	TODO
	-$(NPM) test

.PHONY: setup
setup: node_modules/setup-dummy

node_modules/setup-dummy: package.json
ifeq (npm,$(NPM))
ifneq ($(CI),)
	$(NPM) ci
else
	$(NPM) install
endif
else
	$(NPM) install
endif
	$(call touch,node_modules/setup-dummy)
