export const mapPublicSettings = (settings) => {
  if (!settings) {
    return null;
  }

  return {
    _id: settings._id,
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    logo: settings.logo,
    socialLinks: settings.socialLinks,
    footerText: settings.footerText,
    contactEmail: settings.contactEmail,
    home: settings.home,
    updatedAt: settings.updatedAt
  };
};
