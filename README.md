# Electron Clock App

This is an Electron application with a Windows installer that includes a custom icon.

## Icon Information

The application uses a custom clock icon generated with the sharp library. The icon includes:

- Multiple resolutions (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
- Blue color scheme representing a digital clock
- Hour markers and a central dot

## How to Build

To build the Windows installer with the custom icon:

```bash
npm run dist
```

This will generate a setup file in the `dist` folder with the custom icon.
