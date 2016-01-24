
export function pathToStorePath(root = '/', path = [], interestedProperty) {
  const updatePath = path.reduce((updatePath, entry) => {
    if (!entry) return updatePath;
    updatePath.push('entries', entry);
    return updatePath;
  }, [root]);
  if (interestedProperty) updatePath.push(interestedProperty);
  return updatePath;
}
