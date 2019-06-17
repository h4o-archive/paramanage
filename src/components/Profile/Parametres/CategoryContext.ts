import React from "react"

export const CategoryContext = React.createContext({ categoryId: "0", font_and_background_color: {} as Readonly<{ background: string, color: string }> }) 