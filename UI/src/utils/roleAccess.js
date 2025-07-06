export const hasAccess = (category, feature) => {
    const access = JSON.parse(localStorage.getItem('roleAccess') || '{}');
    return access?.[category]?.[feature] ?? false;
  };
  