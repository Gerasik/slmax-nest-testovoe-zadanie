import { ChangeEvent, useState } from "react"

export const useForm = <T>(callback: () => void, initialState: T) => {
  const [values, setValues] = useState(initialState)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const onSubmit = () => {
    callback()
  }

  return {
    onChange,
    onSubmit,
    values,
  }
}
