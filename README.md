# layouter-client-helper

## install
```
$ yarn add https://github.com/kazukinagata/layouter-client-helper.git
```

## Usage
```typescript
/**
 * Types
 * */
type SVGForm = {
  [inputId: string]: {
    id: string
    tag: string
    label: string
    value: string
  }
}
type Inputs = {
  [svgId: string]: SVGForm
}

type Setting {
  token: string
  layoutId: string
  inputs: Inputs
}
```

```typescript
/**
 * Instantiate
 * */
// ES6
import ClientHelper from 'layouter-client-helper'
// or commonjs
const ClientHelper = require('layouter-client-helper').default

/* レイアウトの設定ファイルを読み込みます */
const setting: Setting = /** Parse from layout.config.json */

const helper = new ClientHelper(settings.token, settings.layoutId)
```

```typescript
/**
 * Initialize layout
 * */

// svgをbase64エンコーディングした値の配列を返します
// 表・裏の名刺データの場合、2つのsvgが配列に含まれます
helper.initialize().then((base64s: string[]) => {

  // imgタグのsrc属性に与えてsvgを表示
  const img = document.getElementById('myImage')
  img.src = `data:image/svg+xml;base64,${base64s[0]}`
})
```

```typescript

/**
 * Update layout
 * */

// クライアント側でフォームを作成してClientHelper.prepareDataに渡します
// ClientHelper.prepareDataはInputs型の引数を一つ受け取ります
// 更新したinputデータだけでなく、未更新のinputデータも含めてください
const getFormDataSample = (): Inputs => {
  const initialInputs = {...setting.inputs}
  // Update initialInputs by form values
  return initialInputs
}

helper.update(ClientHelper.prepareData(getFormDataSample())).then((base64: string[]) => {
  // Same as initialize
})

```

```typescript
// フォームの入力内容を元にpngを取得します
helper.toPng(ClientHelper.prepareData(getFormDataSample())).then((buffers: ArrayBuffer[]) => {
  // Do something
})
```

```typescript
// レイアウト一覧用にサムネイルURLを取得します
// 表・裏のレイアウトの場合２つのurlを返します
helper.getThumbnail().then((buffers: string[]) => {
  // Do something
})
```

## Ex) Create form
```typescript
const setting: Setting = /** Parse from layout.config.json */
const inputs = setting.intputs

// example
const svgIds = Object.keys(inputs)
const svgInputs = inputs[svgIds[0]]

const svgForm = document.getElementById('myForm')

Object.keys(svgInputs).forEach((key) => {
  const input = svgInputs[key]
  const el = document.createElement(input.tag)
  el.name = input.id
  el.value = input.value
  svgForm.appendChild(el)
})
```

