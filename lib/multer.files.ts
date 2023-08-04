function isFilesEmpty(
  files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined,
): boolean {
  if (!files) return true;
  return Object.keys(files).length === 0;
}

export { isFilesEmpty };
