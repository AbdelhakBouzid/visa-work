import { Settings } from '../models/Settings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { mapPublicSettings } from '../utils/publicSettings.js';

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return settings;
};

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  if (req.user) {
    res.json({ settings });
    return;
  }

  res.json({ settings: mapPublicSettings(settings) });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  settings.siteName = req.body.siteName ?? settings.siteName;
  settings.siteDescription = req.body.siteDescription ?? settings.siteDescription;
  settings.logo = req.body.logo ?? settings.logo;
  settings.footerText = req.body.footerText ?? settings.footerText;
  settings.contactEmail = req.body.contactEmail ?? settings.contactEmail;
  settings.socialLinks = {
    ...settings.socialLinks,
    ...(req.body.socialLinks || {})
  };
  settings.home = {
    ...settings.home.toObject(),
    ...(req.body.home || {}),
    sectionTitles: {
      ...settings.home.sectionTitles,
      ...(req.body.home?.sectionTitles || {})
    }
  };

  await settings.save();

  res.json({
    message: 'تم تحديث إعدادات الموقع بنجاح.',
    settings
  });
});
