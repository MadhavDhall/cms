import React from "react"

const Form = (props) => {
    const { inputs, data, setData, submit, submitValue } = props

    let name, value
    const changeValue = (e) => {
        name = e.target.name
        value = e.target.value

        setData({ ...data, [name]: value })
    }

    return (
        <form method="POST" onSubmit={submit} className="col-12 col-md-6 d-flex flex-column justify-content-center">
            {inputs.map((input, key) => {
                const { type, name, placeholder, icon } = input

                return (
                    <div className="input-field" key={key}>
                        <input value={data[name]} onChange={changeValue} required type={type} name={name} id={key} placeholder={placeholder} autoComplete="on" />
                        <label htmlFor={key} className={icon}></label>
                    </div>
                )
            })
            }
            <input type="submit" value={submitValue} className="btn btn-success" />
        </form>
    )
}

export default Form