# call-dll-webpack-plugin

Call Dll immediately

## Install

- webpack 4 
`yarn add call-dll-webpack-plugin`

- webpack 3 
`yarn add call-dll-webpack-plugin@0.2`

## Usage
```javascript
plugins: [
  // call last module
  new CallDllPlugin(), 

  // call module by name
  new CallDllPlugin({
    callModuleName: "./myEntry.js"
  }),

  // call module by id (resolved)
  new CallDllPlugin({
    callModuleId: "myModuleStaticId"
  }),
]

```
