class CustomError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export default CustomError
