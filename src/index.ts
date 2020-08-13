import axios from 'axios'

export type SVGForm = {
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

type UpdateParam = { uuid: string; value: string }

const API_ROOT =
  process.env.NODE_ENV === 'production' ? 'any' : 'http://localhost:9000'
export default class {
  constructor(private token: string, private docId: string) {}

  static prepareData(data: Inputs): UpdateParam[] {
    return Object.keys(data).reduce<UpdateParam[]>((result, key) => {
      const fields = data[key]
      return [
        ...result,
        ...Object.keys(fields).map((key) => ({
          uuid: key,
          value: fields[key].value,
        })),
      ]
    }, [])
  }

  async load(): Promise<string[]> {
    try {
      const res = await axios.get<string[]>(
        `${API_ROOT}/api/svg/${this.docId}`,
        {
          params: {
            token: this.token,
          },
        }
      )
      return res.data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async update(params: UpdateParam[]) {
    try {
      const res = await axios.post<string[]>(
        `${API_ROOT}/api/svg/${this.docId}`,
        {
          token: this.token,
          params,
        }
      )

      return res.data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async toPng(params: UpdateParam[]) {
    // do something stuff
    const res = await axios.post<ArrayBuffer[]>(
      `${API_ROOT}/api/svg/${this.docId}/png`,
      {
        token: this.token,
        params,
      }
    )
    return res.data
  }

  async getThumbnail() {
    // do something stuff
    const res = await axios.get<ArrayBuffer>(
      `${API_ROOT}/api/svg/${this.docId}/thumbnail`
    )
    return res.data
  }
}
