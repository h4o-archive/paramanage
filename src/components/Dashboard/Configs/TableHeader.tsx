import React from "react"

/**
 * @description header of the table of configs
 */
export const TableHeader: React.FunctionComponent<Readonly<{ className: string, style: React.CSSProperties }>> = (props) => {
  return (
    <div {...props}>
      <div className="left aligned column">
        <h3 className="ui header">Range of version</h3>
      </div>
      <div className="left aligned column">
        <h3 className="ui header">Status</h3>
      </div>
      <div className="left aligned column">
        <h3 className="ui header">Specific profile</h3>
      </div>
      <div className="left aligned column">
        <h3 className="ui header">Mutual profile</h3>
      </div>
    </div>
  )
}