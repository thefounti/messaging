
import PropTypes from 'prop-types';
import { Dimensions, FlatList, PixelRatio, StyleSheet } from 'react-native';

export default Grid = (props) => {
    const renderGridItem = (info) => {
        const { index } = info;
        const { renderItem, numColumns, itemMargin } = props;

        const { width } = Dimensions.get('window');

        const size = PixelRatio.roundToNearestPixel(
            (width - itemMargin * (numColumns - 1)) / numColumns,
        )

        ///MIRAMOS DE NO PONER MARGINLEFT AL PRIMERO DE LAIZQUIERDA
        const marginLeft = index % numColumns === 0 ? 0 : itemMargin;

        ///MIRAMOS DE NO PONER MARGINTOP A LOS DE LA PRIMERA COLUMNA
        const marginTop = index < numColumns ? 0 : itemMargin;

        return renderItem({ ...info, size, marginLeft, marginTop });
    }

    return (
        <FlatList {...props} renderItem={renderGridItem}/>
    )

}

Grid.propTypes = {
    renderItem: PropTypes.func.isRequired,
    numColumns: PropTypes.number,
    itemMargin: PropTypes.number,
}

Grid.defaultProps = {
    numColumns: 4,
    itemMargin: StyleSheet.hairlineWidth,
}