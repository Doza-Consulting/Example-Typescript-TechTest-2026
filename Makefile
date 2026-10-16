.DEFAULT_GOAL := help

.PHONY: help install dev dev-api dev-ui build build-api build-ui build-lambda test test-api test-ui clean

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (api + ui workspaces)
	npm install

# --- Dev -------------------------------------------------------------------

dev: ## Run API (:3000) and UI (:5173) together
	npm run dev

dev-api: ## Run only the API
	npm run dev -w api

dev-ui: ## Run only the UI
	npm run dev -w ui

# --- Build (for hosting) ---------------------------------------------------

build: build-api build-ui build-lambda ## Build everything for hosting

build-api: ## Compile the API to api/dist
	npm run build -w api

build-ui: ## Build the static UI to ui/dist
	npm run build -w ui

build-lambda: ## Bundle the API for AWS Lambda to api/dist-lambda
	npm run build:lambda -w api

# --- Test ------------------------------------------------------------------

test: test-api test-ui ## Run all tests

test-api: ## Run API tests (Jest)
	npm test -w api

test-ui: ## Run UI tests (Vitest)
	npm test -w ui

# --- Housekeeping ----------------------------------------------------------

clean: ## Remove build output
	rm -rf api/dist api/dist-lambda ui/dist terraform/.build
