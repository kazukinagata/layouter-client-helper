# layouter-client-helper

## Install
```
$ echo "@koishidev:registry=https://npm.pkg.github.com" >> .npmrc
// アクセストークンは管理者にお問い合わせください
$ echo "//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_AUTH_TOKEN}" >> .npmrc

$ npm install @koishidev/layouter-client-helper
// or
$ yarn add @koishidev/layouter-client-helper
```

## Usage
```typescript
/**
 * Types
 * */
export type Tag = 'input' | 'textArea'
export interface SVGFormAttrs {
  id: string
  tag: Tag
  label: string
  fieldId: string
  value: string
  order: number
  parent?: string
}
export interface SVGForm {
  [inputId: string]: SVGFormAttrs
}
export interface Inputs {
  [svgId: string]: {
    name: string
    elements: SVGForm
  }
}

export interface UpdateParam {
  uuid: string
  value: string
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

/* レイアウトの設定ファイルを読み込みます */
const setting: Setting = /** load from layout.config.json */

const helper = new ClientHelper(setting.token, setting.layoutId)
```

```typescript
/**
 * Initialize layout
 * */

// svgをbase64エンコーディングした値の配列を返します
// 表・裏の名刺データの場合、2つのsvgが配列に含まれます
helper.initialize().then((base64: string) => {

  // imgタグのsrc属性に与えてsvgを表示
  const img = document.getElementById('myImage')
  img.src = `data:application/pdf;base64,${base64}`
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

helper.update(ClientHelper.prepareData(getFormDataSample())).then((base64: string) => {
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
helper.getThumbnail().then((urls: string[]) => {
  // Do something
})
```

## API

### constructor
---
params

||type|default|note|
|-----|-----|---|---|
|token|string|-|config.jsonに含まれるtokenフィールド値を挿入|
|docId|string|-|config.jsonに含まれるlayoutIdフィールド値を挿入|
|version|string \| undefined|-|config.jsonに含まれるversionフィールド値を挿入|
|apiRoot|string|http://localhost:9000/api/v1|<ul><li>staging: https://layouter-editor-server-stg.herokuapp.com/api/v1</li><li>production: https://layouter-editor-server.herokuapp.com/api/v1</li>|



### getInit
---
getInit ( ): Promise<string[]>

---
Returns Promise<string[]>

---
レイアウトsvgをbase64エンコードした値を配列で返します。

### update
---
update (params: UpdateParam[]): Promise<{svg: string[], pdf: string}>

---
Returns Promise<{svg: string[], pdf: string}>

---
フォームの入力をレイアウトに反映し、テキストの位置調整、テキストのアウトライン化が完了したsvg及びpdfをbase64エンコードして返します。

### toPng
---
toPng (params: UpdateParam[], size: 'thumbnail' | 'full' = 'full'): Promise<ArrayBuffer[]>

---
Returns Promise<ArrayBuffer[]>

---
フォームの入力内容をレイアウトに反映し、PNGに変換して配列で返します。
表・裏レイアウトの場合には二つのpngが配列に含まれます。

### getThumbnail
---
getThumbnail ( ): Promise<string[]>

---
Returns Promise<string[]>

---
レイアウトのサムネイルPNG画像を配列で返します。
レイアウト一覧表示を意図したもので、編集結果の画像を取得する場合は`toPng`を使用してください。

### batchCreate
---
batchCreate ( contents: {[clientId: string]: {uuid: string; value: string}[]} ): Promise< string >

---
Returns Promise< string >

---
名刺一括作成時のサムネイル画像とpdf生成のbackground jobを実行し、jobIdを返します。

### batchPolling
---
batchPolling ( id: string ): {
  id: string,
  status: 'completed' | 'waiting' | 'active' | 'delayed' | 'failed' | 'paused',
  value?: {[clientId:string]: {svg: string[], pdf: string}},
  progress: number
  }

---
jobの実行状況を返します。statusが`completed`になると、生成したダウンロードURLが含まれるオブジェクトがvalueに渡されます。
progressは0..100の値を取ります。

### static prepareData
---
prepareData(data: Inputs): UpdateParam[]

---
Returns UpdateParam[]


## Ex) Create form
```typescript
const setting: Setting = /** load from layout.config.json */
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

## Demo
- [Live demo](https://layouter-react-demo.herokuapp.com/)
- repo: https://github.com/koishidev/layouter-demo
