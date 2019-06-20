import download from "downloadjs"

import { api } from "apis"

export function exportData() {
  api.get({ url: "/db" }).then(({ data }) => download(JSON.stringify(data), "data.json", "application/json"))
}

export function importData({ target: { files: [file] } }: { target: any }) {
  let reader = new FileReader()
  reader.readAsText(file, "UTF-8")
  reader.onload = ({ target: { result } }: { target: any }) => console.log(JSON.parse(result))
}