import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';

export default function StartScreen() {
    return (
        <View style={styles.root}>
            <CustomButton
                text="Random Choice"
                Press={() => {
                    router.push({
                        pathname: '/SelectList',
                        params: { listType: 'random' }
                    });
                }}
                width={Dimensions.get('screen').width / 1.5}
                marginVertical={10}
            />

            <CustomButton
                text="Logical Choice"
                Press={() => {
                    router.push({
                        pathname: '/SelectList',
                        params: { listType: 'logical' }
                    });
                }}
                width={Dimensions.get('screen').width / 1.5}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#171717',
    }
});