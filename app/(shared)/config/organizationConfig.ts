const organizationConfig = {
  /** `NEXT_PUBLIC` prefix + `PUBLIC_ORGANIZATION_NAME` */
  PUBLIC_ORGANIZATION_NAME:
    process.env.NEXT_PUBLIC_PUBLIC_ORGANIZATION_NAME ?? 'Public'
}

export default organizationConfig
