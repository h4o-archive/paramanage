import React from "react"
import { connect } from "react-redux"

import { _ } from "utils"
import { State } from "reducers";
import { CategoryDB } from "apis";
import { CategoryContext } from "./CategoryContext"

type CategoryMapProps = {
  readonly categorys: CategoryDB[]
}

const Category: React.FunctionComponent<CategoryMapProps> = ({ categorys, ...props }) => {
  return (
    <React.Fragment>
      {categorys.map((category) => {
        const font_and_background_color = _.contrastColorFontAndBackground({ hex: category.color })
        return (
          <React.Fragment key={category.id}>
            <p className={`ui ribbon label`} style={{ ...font_and_background_color, position: "relative", marginLeft: "1em" }}>{category.key} </p>
            <div className={`ui tertiary inverted segment`} style={font_and_background_color}>
              <div className="ui form">
                <CategoryContext.Provider value={{ categoryId: category.id, font_and_background_color }}>
                  {props.children}
                </CategoryContext.Provider>
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

function mapStateToProps(state: State): CategoryMapProps {
  const { parametres, categorys } = state.parametres_reducer
  const using_categorys = _.uniqBy(Object.values(parametres), "categoryId").reduce((using_categorys, parametre) => {
    using_categorys.push(categorys[parametre.categoryId])
    return using_categorys
  }, [] as CategoryDB[])
  return {
    categorys: using_categorys.sort(_.compareObjectAscendinBaseOnKey("order"))
  }
}

const ConnectedCategory = connect<CategoryMapProps, {}, {}, State>(mapStateToProps)(Category)

export { ConnectedCategory as Category }