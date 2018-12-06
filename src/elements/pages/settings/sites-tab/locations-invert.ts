export const locationsInvert = R.pipe(
    R.groupBy((site: Site) => site.parent.id),
    R.map((groupedSites: Site[]) => {
        const parent = groupedSites[0].parent;
        return {...parent, sites: groupedSites};
    }, R.__),
    R.values,
    R.sortBy(
        R.compose(R.toLower, R.prop('name'))
    )
);