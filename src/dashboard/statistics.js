import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import { BarChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



export default function Statistics() {
    const [selectedValue, setSelectedValue] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [statistics, getStatisctics] = useState();
    const [dailyViewCounts, setDailyViewCounts] = useState([]);

    const currentMonth = new Date().getMonth() + 1;
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const data = Array.from({ length: currentMonth }, (_, index) => ({
        label: months[index],
        value: months[index] 
    }));

    const getStats = async (selectedMonth) => {
        console.log("month", selectedMonth)
        try {
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${BASE_URL}api/dashboard/statistics/${selectedMonth}`, config);

            if (response.data) {
                getStatisctics(response.data);
                const viewCounts = response.data.data.views.map(dayData => dayData.count);
                setDailyViewCounts(viewCounts);


            } else {
                console.log('Network not ok');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStats(selectedValue);
    }, [selectedValue]);



    return (
        <View>
            <View style={styles.statusContainer}>
                <Feather
                    name="clock"
                    size={24}
                    color="#000"
                />
                <DropDownPicker
                    open={isOpen}
                    value={selectedValue}
                    items={data}
                    setOpen={setIsOpen}
                    setValue={setSelectedValue}
                    placeholder="Select a month"
                    style={{ backgroundColor: '#fff', borderColor: '#fff', zIndex: 1, position: 'relative' }}
                    onChangeItem={(item) => {
                        setSelectedValue(item.value); 
                    }}
                />
            </View>
            <View style={styles.barChart}>
                <BarChart
                    data={{
                        labels: ['05', '10', '15', '20', '25', '30'],
                        datasets: [
                            {
                                data: dailyViewCounts,
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width - 50}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        color: (opacity = 1) => `#407BFF`,
                        labelColor: () => '#000',
                        barPercentage: 1,
                        style: {
                            borderRadius: 16,
                            borderStyle: 'solid', // Change dotted lines to solid
                        },
                        fromZero: true,
                        axisLabelColor: () => 'black', // Set labels to black color
                    }}
                    style={{
                        marginLeft: '6%',
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    statusContainer: {
        marginTop: '10%',
        marginLeft: '5%',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        paddingLeft: "8%",
        paddingRight: "6%",
        width: '60%',
        borderRadius: 25,
    },
    barChart: {
        paddingRight: "10%",
        marginTop: "10%",
        backgroundColor: "#fff",
        zIndex: -1,
    }
})