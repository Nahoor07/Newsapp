import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Layout = ({ children, style }) => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[{ paddingTop: insets.top }, style]}>
            <View style={styles.containerCenter}>
                <View style={styles.mainContainer}>
                    {children}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    containerCenter: {
        alignItems: 'center',
    },
    mainContainer: {
        width: '100%',
        maxWidth: 400,
        paddingHorizontal: 10,
    },
})

export default Layout;