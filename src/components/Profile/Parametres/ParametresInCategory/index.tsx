import React, { useContext } from "react"
import { connect } from "react-redux"

import { _ } from "utils"
import { State } from "reducers";
import { CategoryContext } from "../CategoryContext"
import { ParametreLabel } from "./ParametreLabel"
import { ParametresState } from "../parametres_reducer";

type ParametresInCategoryMapProps = {
  readonly parametres: ParametresState
}

const ParametresInCategory: React.FunctionComponent<ParametresInCategoryMapProps> = ({ parametres }) => {

  const { categoryId } = useContext(CategoryContext)

  return (
    <React.Fragment>
      {_.map(parametres, (parametre) => {
        if (parametre.categoryId === categoryId) {
          return (
            <div className="field" key={parametre.id}>
              <ParametreLabel parametre={parametre} />
              <input placeholder={parametre.value} type="text" readOnly />
            </div>
          )
        } else return null
      })}
    </React.Fragment>
  )
}

function mapStateToProps(state: State): ParametresInCategoryMapProps {
  return { parametres: state.parametres_reducer.parametres }
}

const ConnectedParametresInCategory = connect<ParametresInCategoryMapProps, {}, {}, State>(mapStateToProps)(ParametresInCategory)

export { ConnectedParametresInCategory as ParametresInCategory }