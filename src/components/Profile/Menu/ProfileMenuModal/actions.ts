import { api } from "apis"
import { fetchProfile } from "components/Profile/Parametres/actions"
import { _ } from "utils"
import { FormFields } from "./EditAddModal";
import { ReduxThunk, DESELECT } from "actions/types";
import { CategorysState, SelectedParametresState } from "components/Profile/Parametres/parametres_reducer";

export function updateParametres(values: FormFields[]): ReduxThunk {
  return async (dispatch, getState) => {
    for (let i = 0; i < values.length; i++) {
      if (getState().parametres_reducer.parametres[_.hashText(values[i].key)]) var modify = true
      await __addOrModifyCategoryIfNecessary__(getState().parametres_reducer.categorys, { category: values[i].category, category_color: values[i].category_color })
      let parametre_from_form = { id: _.hashText(values[i].key), key: values[i].key, value: values[i].value, categoryId: _.hashText(values[i].category), profileId: getState().parametres_reducer.profile.id }
      // ignore ts because it doesn't allow check a variable which might be undefined, which destroy beauty of JS
      // @ts-ignore
      if (modify) await api.put({ url: `/parametres`, id: parametre_from_form.id, json: parametre_from_form })
      else await api.post({ url: `/parametres`, json: parametre_from_form })
      await dispatch({
        type: DESELECT.PARAMETRE,
        payload: parametre_from_form.id
      })
      _.sleep(100)
    }
    dispatch(fetchProfile(getState().parametres_reducer.profile.id))
  }
}

async function __addOrModifyCategoryIfNecessary__(categorys: CategorysState, { category, category_color }: { category: string, category_color: string }): Promise<void> {
  if (!categorys[_.hashText(category)]) {
    await api.post({
      url: `/categorys`, json: {
        id: _.hashText(category),
        order: category.toLowerCase(),
        key: category,
        color: category_color
      }
    })
  } else if (category_color !== categorys[_.hashText(category)].color) {
    await api.patch({ url: `/categorys`, id: _.hashText(category), json: { color: category_color } })
  }
}

export function deleteParametres(selected: SelectedParametresState): ReduxThunk {
  return async (dispatch, getState) => {
    for (let key in selected) {
      const parametre = getState().parametres_reducer.parametres[key]
      await api.delete({ url: `/parametres`, id: parametre.id })
      await dispatch({
        type: DESELECT.PARAMETRE,
        payload: parametre.id
      })
      if (parametre.categoryId !== getState().parametres_reducer.default_category_id) {
        const { data: parametres_of_category } = await api.get({ url: `/categorys/${parametre.categoryId}/parametres` })
        if (_.isEmpty(parametres_of_category)) await api.delete({ url: `categorys`, id: parametre.categoryId })
      }
    }
    dispatch(fetchProfile(getState().parametres_reducer.profile.id))
  }
}