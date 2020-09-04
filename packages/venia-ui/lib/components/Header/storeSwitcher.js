import React from 'react';
import { bool, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';

import { mergeClasses } from '../../classify';
import defaultClasses from './storeSwitcher.css';
import GET_AVAILABLE_STORES_CONFIG_DATA from '../../queries/getAvailableStoresConfigData.graphql';
import LinkButton from '../LinkButton';
import LoadingIndicator from '../LoadingIndicator';

import CREATE_CART_MUTATION from "../../queries/createCart.graphql";
import {mergeCartsMutation} from "../../queries/mergeCarts.gql";

const StoreSwitcher = props => {
    const { mobileView } = props;
    const talonProps = useStoreSwitcher({
        query: GET_AVAILABLE_STORES_CONFIG_DATA,
        createCartMutation: CREATE_CART_MUTATION,
        mergeCartsMutation,
    });

    const { handleSwitchStore, availableStores, isLoading } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const className = mobileView ? classes.root_mobile : classes.root;
    const { formatMessage } = useIntl();
    const triggerClassName = classes.storeSwitcherContainer;

    let children = null;

    if (isLoading) {
        children = <LoadingIndicator classes={{ root: classes.loading }} />;
    }

    if (availableStores) {
        const hasMultipleStores =
            Object.keys(availableStores).length > 1 || null;
        const stores = Object.keys(availableStores).map(storeCode => {
            return (
                <LinkButton
                    key={storeCode}
                    onClick={() => {
                        handleSwitchStore(storeCode);
                    }}
                >
                    <span>
                        {availableStores[storeCode].storeName}{' '}
                        {availableStores[storeCode].is_current}
                    </span>
                </LinkButton>
            );
        });
        if (hasMultipleStores) {
            window.document.documentElement.style.setProperty(
                '--header-height',
                '10rem'
            );
        }
        children = hasMultipleStores ? (
            <div className={triggerClassName}>{stores}</div>
        ) : null;

        if (hasMultipleStores) {
            window.document.documentElement.style.setProperty('--header-height', '10rem');
        }
    }

    return <div className={className}>{children}</div>;
};

export default StoreSwitcher;

StoreSwitcher.propTypes = {
    classes: shape({
        root: string,
        root_mobile: string,
        storeSwitcherContainer: string,
        current: string
    }),
    mobileView: bool
};
