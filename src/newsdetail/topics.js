import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Politics from "./politics";
import Entertainment from "./entertainment";
import All from "./all";
import Sports from "./sports";
import { BASE_URL } from '@env';


const Topics = (props) => {
    const [activeTab, setActiveTab] = useState("All");

    const data = {
        All: [<All data={props.data} />],
        Sports: [<Sports />],
        Politics: [
            <Politics />,

        ],
        Entertainment: [
            <Entertainment />,

        ],
    };

    const renderTabOptions = () => {
        return data[activeTab].map((item, index) => (
            <View key={index}>{item}</View>
        ));
    };

    return (
        <View style={customStyles.container}>
            <View style={customStyles.main}>
                <View style={customStyles.tabs}>
                    {Object.keys(data).map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                customStyles.tab,
                                activeTab === category && customStyles.tabActive,
                            ]}
                            onPress={() => setActiveTab(category)}
                        >
                            <Text style={[
                                customStyles.tabTitle,
                                activeTab === category && { color: "#407BFF" },
                            ]}
                            >{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={customStyles.tabOptions}>
                    <View style={customStyles.tabOptionsActive}>
                        {renderTabOptions()}
                    </View>
                </View>
            </View>
        </View >
    );
};

const customStyles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
        padding: 20,
    },
    main: {
        paddingVertical: 5,
        paddingHorizontal: 3,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    tabs: {
        flexDirection: "row",
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: "#ddd",
    },
    tabActive: {
        borderBottomColor: "#407BFF",
    },
    tabTitle: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#888888",
    },
    tabOptions: {
        flexDirection: "row",
        justifyContent: "center",
    },
    tabOptionsActive: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    component: {
        width: "30%",
        alignItems: "center",
        marginBottom: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
    componentTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#000",
    },
});

export default Topics;
