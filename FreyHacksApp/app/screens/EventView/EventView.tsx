import { useContext } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { client } from '../../../client'
import { UserContext } from '../../../contexts'
import { tryGetSetUser } from '../../../queries'
import { ZacButton } from '../../components/ZacButton'
import { COLORS } from '../../settings'
import { REGISTER, UNREGISTER } from './mutations'

export const EventView = ({ route, navigation }: { navigation: any, route: { params: { event: ActivityEvent } } }) => {
	const { user, setUser} = useContext(UserContext)
	const event = route.params.event
	const registered = user?.event_ids.includes(event.id)
	const tryRegister = async () => {
		const response = await client.mutate({
			mutation: REGISTER,
			variables: {id: event.id, username: user?.username}
		})
		if (!response.errors) {
			const data = response.data
			if (data.registerForEvent.success) {
				Alert.alert('Registered!', 'Registered for '+event.name, [{ text: 'OK'  }])
				if (user) setUser({...user, event_ids: [...user?.event_ids, event.id]})
			}
			else Alert.alert('Error', JSON.stringify(data.registerForEvent.errors), [{ text: 'OK'  }])
		} else Alert.alert('Error', JSON.stringify(response.errors), [{ text: 'OK'  }])
	}

	const tryUnRegister = async () => {
		const response = await client.mutate({
			mutation: UNREGISTER,
			variables: {id: event.id, username: user?.username}
		})
		if (!response.errors) {
			const data = response.data
			if (data.unregisterFromEvent.success) {
				if (user) setUser({...user, event_ids: [...user?.event_ids].filter(id => id != event.id)})
			}
			else Alert.alert('Error', JSON.stringify(data.unregisterFromEvent.errors), [{ text: 'OK'  }])
		} else Alert.alert('Error', JSON.stringify(response.errors), [{ text: 'OK'  }])
	}
	return (
		<View style={styles.container}>
			<Text style={styles.header}>{event.name}</Text>
			<Text style={styles.header}>End Time: {event.end_time}</Text>
			<Text style={styles.header}>Lat: {event.lat}</Text>
			<Text style={styles.header}>Lon: {event.lon}</Text>
			<TouchableOpacity style={styles.activitySection} onPress={() => navigation.navigate('Activity', { activity: event.activity })}>
				<Text>{event.activity.name}</Text>
			</TouchableOpacity>
			<ZacButton 
				text={registered?'Unregister':'Register'} 
				onPress={registered?tryUnRegister:tryRegister} 
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.blue,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 20,
	},
	header: {
		color: 'black',
		fontSize: 40,
		textAlign: 'center',
	},
	description: {
		color: 'black',
		fontSize: 25,
		margin: 20,
	},
	content: {
		color: 'white',
		fontSize: 20,
		padding: 5,
	},
	footer: {
		color: 'black',
		fontSize: 20,
		marginTop: 20,
		fontStyle: 'italic',
	},
	activitySection: {
		backgroundColor: 'white',
		width: '80%',
		margin: 20,
		padding: 10,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
})