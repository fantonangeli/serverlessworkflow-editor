<!--
   Copyright 2021-Present The Serverless Workflow Specification Authors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
-->

# @serverless-workflow-settings/linter

Shared linting and formatting configuration for the Serverless Workflow Editor monorepo.

## Overview

This package provides centralized configuration for Oxlint and Oxfmt

## Usage

### In Consumer Packages

```json
{
  "name": "your-package-name",
  "scripts": {
    "lint": "linter src/ stories/"
  },
  "devDependencies": {
    "@serverless-workflow-settings/linter": "workspace:*"
  }
}
```

## Extending Configuration

To extend the configuration in a specific package, create a local `oxlintrc.json`:

```json
{
  "extends": ["node_modules/@serverless-workflow-settings/linter/oxlintrc.json"]
}
```
