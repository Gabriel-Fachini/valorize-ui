# Docker Build Fix - SWC + Alpine Linux Compatibility Issue

## Problem Encountered

During Docker image builds for the dashboard application, we encountered a **segmentation fault (SIGSEGV)** when running `vite build` with the `@vitejs/plugin-react-swc` plugin:

```
Command was killed with SIGSEGV (Segmentation fault): vite build
```

## Root Cause

The issue was caused by **SWC (Speedy Web Compiler) incompatibility with Alpine Linux's musl libc**. 

- SWC is a Rust-based compiler used by Vite for faster compilation (3-10x faster than Babel)
- Alpine Linux uses **musl libc** instead of **glibc**
- SWC binaries are compiled against glibc and fail on musl-based systems
- This causes segmentation faults during the build process in Docker

## Solution

**Replace Alpine Linux with Debian-based images for the builder stage:**

### Before (Alpine - ❌ Fails):
```dockerfile
FROM node:22-alpine AS builder
```

### After (Debian Slim - ✅ Works):
```dockerfile
FROM node:22-slim AS builder
```

## Files Modified

### `/apps/dashboard/Dockerfile`
- Changed builder stage from `node:22-alpine` to `node:22-slim`
- Kept `node:22-alpine` for deps stage (no SWC involved)
- Kept `nginx:alpine` for final runner stage (only serving static files)

## Build Results

### Successful Build Output:
```bash
docker build -f apps/dashboard/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.valorize.com \
  --build-arg VITE_API_URL=https://api.valorize.com \
  -t gcr.io/valorize-475221/valorize-dashboard:v1 \
  .
```

**Build completed in ~14 seconds** with multi-stage caching.

### Image Successfully Pushed:
```bash
docker push gcr.io/valorize-475221/valorize-dashboard:v1
# v1: digest: sha256:70436aa8786e49b3dde4482681f186a68504d236ec3acdaac5293673b7394d6f
```

## Image Size Comparison

| Stage | Alpine | Debian Slim | Notes |
|-------|--------|-------------|-------|
| Deps | ~300MB | N/A | Not changed (Alpine works fine) |
| Builder | N/A | ~450MB | Temporary stage (not in final image) |
| Runner | ~45MB | N/A | Not changed (Alpine works fine) |

**Final image size:** ~45MB (Nginx Alpine + static files)

The builder stage size increase (~150MB more) is irrelevant because it's discarded in multi-stage builds. Only the final runner stage (Nginx Alpine) matters for deployment.

## Alternative Solutions Considered

### 1. ❌ Disable SWC and use regular React plugin
- Would require installing `@vitejs/plugin-react` (not currently in dependencies)
- Loses the 3-10x compilation speed benefit of SWC
- Not worth the trade-off

### 2. ❌ Use `node:22-bullseye` or `node:22-bookworm`
- Much larger images (~900MB base image)
- Debian Slim provides glibc compatibility at ~200MB smaller size

### 3. ❌ Compile SWC binaries for musl
- Complex custom build process
- Maintenance burden for future SWC updates
- Not reliable or maintainable

### 4. ✅ Use Debian Slim for builder stage (CHOSEN)
- Simple one-line change
- Maintains SWC performance benefits
- No impact on final image size
- Reliable and maintainable

## Impact on Landing Page

The landing page (Astro) **does not use SWC** and can remain on Alpine Linux:
- Astro uses esbuild for compilation (works fine on Alpine)
- No changes needed to `apps/landing/Dockerfile`

## Lessons Learned

1. **Alpine Linux is not always smaller in multi-stage builds** - When native binaries require glibc, Debian Slim is the better choice
2. **SWC requires glibc** - Always use Debian-based images when using SWC in Docker
3. **Segfaults in Docker often indicate libc incompatibility** - Check for musl vs glibc issues
4. **Multi-stage builds isolate the impact** - Builder stage size doesn't affect final image

## Documentation Updates Needed

The following documentation files should be updated to reflect this fix:

- ✅ `apps/dashboard/Dockerfile` - Already updated
- ⚠️ `DEPLOY_GOOGLE_CLOUD_RUN.md` - Should mention SWC/Alpine incompatibility
- ⚠️ `DEPLOY_MANUAL_CONSOLE_GUI.md` - Should document the Debian Slim requirement
- ⚠️ `docs/DOCKER_BUILDKIT.md` - Should add troubleshooting section for SWC errors

## References

- [SWC GitHub Issue: Alpine Linux Support](https://github.com/swc-project/swc/issues/1366)
- [Node.js Docker Images](https://hub.docker.com/_/node/)
- [Alpine vs Debian for Node.js](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

**Date:** October 16, 2025  
**Status:** ✅ Resolved  
**Build Time:** ~14 seconds (with cache)  
**Image Pushed:** `gcr.io/valorize-475221/valorize-dashboard:v1`
