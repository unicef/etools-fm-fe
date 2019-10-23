export function locationsInvert(sites: Site[]): IGroupedSites[] {
    const groupedByParent: GenericObject<Site[]> = sites.reduce((group: GenericObject<Site[]>, site: Site) => {
        const id: string = site.parent.id;
        if (!group[id]) { group[id] = []; }
        group[id].push(site);
        return group;
    }, {});

    return Object.values(groupedByParent)
        .map((groupedSites: Site[]) => {
            const parent: ISiteParrentLocation = groupedSites[0].parent;
            return { ...parent, sites: groupedSites };
        })
        .sort((first: ISiteParrentLocation, second: ISiteParrentLocation) => first.name.toLowerCase() < second.name.toLowerCase() ? -1 : 1);
}
