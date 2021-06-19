module.exports = {
    get: async function (page, data, shippingCountryNames, variants) {
        const SHIPS_FROM = 'Ships From';

        return new Promise(async (resolve) => {
            let result = [];
            if (Array.isArray(shippingCountryNames) && shippingCountryNames.length > 0) {
                let shipsFrom = variants.options.find(x => x.name === SHIPS_FROM);

                /**
                 * add all country where the product can come from if sku property "Ships From" is defined
                 */
                if (typeof shipsFrom === 'object') {
                    shipsFrom.values.forEach((countryObj) => {
                        result.push({
                            from: countryObj.name,
                        });
                    });
                } else {
                    /**
                     * else add only the "data.storeModule.countryCompleteName" as the country where the product can come from
                     */
                    result.push({
                        from: data.storeModule.countryCompleteName,
                    });
                }

                await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});
                /**
                 * result: all the country where the product can come from
                 * needSelectFrom: define if the product has multiple country where the product can come from
                 *  if true => multiple country: need to select the country in "Ships From" DOM
                 *  if false => 1 country: no select available
                 */
                result = await page.evaluate((result, shippingCountryTo, needSelectFrom, SHIPS_FROM) => {
                    async function getShippingInformation(countryFrom, shippingCountryTo, needSelectFrom) {
                        return new Promise((resolve) => {
                            let shipsFromDom = null;
                            $('div.product-main div.product-info div.product-sku div.sku-title').each((index, skuElementTitle) => {
                                if ($(skuElementTitle).text().indexOf(SHIPS_FROM) >= 0) {
                                    shipsFromDom = $(skuElementTitle).closest('.sku-property');
                                }
                            });
                            getShippingFrom(countryFrom, shipsFromDom, needSelectFrom, shippingCountryTo, ((result) => {
                                resolve(result);
                            }));
                        });
                    }

                    function getShippingFrom(countryFrom, shipsFromDom, needSelectFrom, shippingCountryTo, callback, index = 0) {
                        if (needSelectFrom) {
                            $(shipsFromDom).find('.sku-property-item').each((i, shipsFromEl) => {
                                if ($(shipsFromEl).text().indexOf(countryFrom[index].from) >= 0) {
                                    /**
                                     * click on the country
                                     */
                                    $(shipsFromEl).click()[0];
                                }
                            });
                            setTimeout(() => {
                                /**
                                 * open "ship to" modal
                                 */
                                $('div.product-main div.product-info div.product-shipping .product-shipping-info').click()[0];
                                selectCountry(shippingCountryTo, (options) => {
                                    countryFrom[index].options = options;
                                    index++;
                                    if (index === countryFrom.length) {
                                        callback(countryFrom);
                                    } else {
                                        $('.next-icon-close').click()[0];
                                        getShippingFrom(countryFrom, shipsFromDom, needSelectFrom, shippingCountryTo, callback, index);
                                    }
                                });
                            }, 1000);
                        } else {
                            /**
                             * open "ship to" modal
                             */
                            $('div.product-main div.product-info div.product-shipping .product-shipping-info').click()[0];
                            selectCountry(shippingCountryTo, (options) => {
                                countryFrom[index].options = options;
                                callback(countryFrom);
                            });
                        }
                    }

                    function selectCountry(shippingCountryTo, callback, index = 0, result = [], time = 400) {
                        const country = {
                            to: shippingCountryTo[index],
                            options: [],
                        };
                        setTimeout(() => {
                            const openListCountry = $('div.logistics div.address span.next-select-values');
                            if ($(openListCountry).length === 1) {
                                time = 0;
                                $(openListCountry)[0].click();
                                selectCountryInlist(country.to, (options) => {
                                    country.options = options;
                                    result.push(country);
                                    index++;
                                    if (index === shippingCountryTo.length) {
                                        callback(result);
                                    } else {
                                        selectCountry(shippingCountryTo, callback, index, result)
                                    }
                                });
                            } else {
                                selectCountry(shippingCountryTo, callback, index, result)
                            }
                        }, time);
                    }

                    function selectCountryInlist(countryName, callback, click = true) {
                        $('div.logistics div.address ul.dropdown-content > li').each((i, countryEl) => {
                            if (click) {
                                if ($(countryEl).text().trim() === countryName) {
                                    $(countryEl).click()[0];
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }).promise().done(() => {
                            setTimeout(() => {
                                const shippingDetail = 'div.logistics div.next-loading';
                                if ($(shippingDetail).hasClass('next-open')) {
                                    click = false;
                                    selectCountryInlist(countryName, callback, click)
                                } else {
                                    const options = [];
                                    $(shippingDetail).find('.table-tr').each((index, shipEl) => {
                                        if (index > 0) {
                                            let tracking = null;
                                            if ($(shipEl).find('.next-icon-select').length === 1) {
                                                tracking = true;
                                            } else if ($(shipEl).find('.next-icon-close').length === 1) {
                                                tracking = false;
                                            }
                                            options.push({
                                                time: $(shipEl).find('.time-cell').text().trim(),
                                                cost: $(shipEl).find(':nth-child(3)').text().trim(),
                                                name: $(shipEl).find('.service-name').text().trim(),
                                                tracking: tracking,
                                            });
                                        }
                                    }).promise().done(() => {
                                        callback(options);
                                    });
                                }
                            }, 200);
                        });
                    }

                    return getShippingInformation(result, shippingCountryTo, shippingCountryTo, needSelectFrom);
                }, result, shippingCountryNames, typeof shipsFrom === 'object', SHIPS_FROM);
                resolve(result);
            } else {
                resolve(result);
            }
        });
    },
};
