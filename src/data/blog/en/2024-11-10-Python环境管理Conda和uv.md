---
title: Flexible Python Environment Management with Conda and uv
author: Wenjie Xu
pubDatetime: 2024-02-09T13:08:36+08:00
modDatetime: 2024-12-05T17:20:03+08:00
description: Python environment management methods for different needs
tags:
  - Python
  - OS-Linux
  - OS-Windows
category: Productivity
featured: false
draft: false
showCopyright: true
slug: "en/python-env-conda-venv"
lang: en
---

## Table of Contents

## Background

Python projects vary widely, from data analysis and machine learning to web development and small utility scripts. Each type has different requirements for Python versions, environment isolation, and dependency management. Simple projects might only need pip for dependencies, but as projects scale or complexity increases, issues like version conflicts and environment bloat emerge.

For example, data science projects often rely on large machine learning libraries (like TensorFlow or PyTorch) requiring stable isolation, while web development or lightweight scripts prioritize lightweight, fast dependency management and flexible Python version switching. Traditional conda is powerful but environments can be several GB, making it cumbersome. Based on this, I've optimized the environment management approach, using a combination of `Conda` and `uv` to replace the previous `conda-pyenv-poetry` setup for more efficient, lightweight Python environment management.

My goals are:

- **`Conda`**: Provide well-isolated heavyweight virtual environments for data science and machine learning projects, allowing multiple similar projects to share environments to save space
- **`uv`**: Provide fast, independent virtual environments for regular projects, with flexible Python version management and dependency locking

## Conda

`Conda` is an open-source package and environment management system originally designed for Python data science projects, but now supports multiple programming languages (like R, Node.js, Java, etc.). Developed by Anaconda, it's widely used in data science, machine learning, and scientific computing.

- **Virtual Environment Isolation**: `Conda` creates fully isolated virtual environments to avoid dependency conflicts, suitable for managing complex scientific computing libraries
- **Automatic Dependency Resolution**: Compared to `pip`, `Conda`'s dependency resolution is more robust
- **Multi-language Support**: Not limited to Python, can manage dependencies for R, Julia, etc.

### Installation and Configuration

Recommend using **Miniforge**, a lightweight `Conda` distribution tailored for the `conda-forge` channel with preset features:

- Defaults to the `conda-forge` community-maintained open-source repository, offering richer, more frequently updated packages than the default `Conda` channel.
- Provides `mamba`, a faster alternative to `Conda` for accelerated package resolution and installation.

**Configuration Optimization**:

```bash
# Disable automatic activation of base environment to avoid interfering with other Python environments
conda config --set auto_activate_base false

# Verify Conda installation:
conda --version
mamba --version
```

> **Note**: On Windows, ensure `Conda`'s PATH priority is lower than `uv`'s Python paths to avoid version conflicts. Adjust the order in system PATH, placing `uv`'s path before Conda.

## uv

`uv` is a modern Python package manager written in Rust, integrating Python version management, virtual environment creation, and dependency management, far outperforming tools like `Pyenv` and `Poetry`. Its core advantages include:

- 🚀 One tool to replace pip, pip-tools, pipx, poetry, pyenv, twine, virtualenv, and more.
- ⚡️ 10-100x faster than pip
- 🗂️ Comprehensive project management with universal lock files
- ❇️ Run scripts with inline dependency metadata
- 🐍 Install and manage Python versions
- 🛠️ Run and install tools published as Python packages
- 🔩 Includes a pip-compatible interface for familiar CLI performance
- 🏢 Supports Cargo-style workspaces for scalable projects
- 💾 Disk-efficient with global caching for dependency deduplication
- ⏬ Installable via curl or pip without Rust or Python
- 🖥️ Supports macOS, Linux, and Windows

### Installation and Setup

**Install UV**:

- On Windows, install using PowerShell:

  ```powershell
  Invoke-WebRequest -Uri "https://astral.sh/uv/install.ps1" -OutFile "install.ps1"; .\install.ps1
  ```

- On Ubuntu or other Linux systems:

  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```

- Verify installation:

  ```bash
  uv --version
  ```

**Configure UV**:

- Set global Python version:

  ```bash
  uv python install 3.11  # Install Python 3.11
  uv python pin 3.11      # Set global default version
  ```

- Specify Python version for a project:

  ```bash
  cd my-project
  uv python pin 3.10      # Project uses Python 3.10
  ```

  This generates a `.python-version` file in the project directory to record the version setting.

- Create virtual environment and manage dependencies:

  ```bash
  uv venv                    # Create virtual environment
  uv add numpy pandas        # Add dependencies
  uv sync                    # Sync dependencies to virtual environment
  ```

  Dependency info is recorded in `pyproject.toml` and `uv.lock` for consistency.

- Verify project environment:

  ```bash
  uv run python -c "import sys; print(sys.executable)"
  ```

  Output should be the project's virtual environment Python path, e.g., `.../my-project/.venv/Scripts/python.exe` (Windows).

- Use UV to build and publish project to PyPI:

  ```bash
  uv build
  uv publish
  ```

- Customize `uv` configuration (uv.toml), e.g., set custom cache directory or configure pip index URL. Create a uv.toml file. This can be placed globally (e.g., ~/.config/uv/uv.toml on Linux/Mac or %APPDATA%\uv\uv.toml on Windows), or in the project directory for project-specific settings.

  ```plaintext
  cache-dir = "/Volumes/Work/Temporary/uv_cache"

  [[index]]
  url = "https://pypi.tuna.tsinghua.edu.cn/simple"
  default = true
  ```
