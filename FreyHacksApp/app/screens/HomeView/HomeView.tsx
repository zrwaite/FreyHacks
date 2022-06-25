import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
const logoImage = require('../../assets/icon.png')
const addImage = require('../../assets/add.png')
const settingsImage = require('../../assets/settings-icon.png')
const eventsImage = require('../../assets/Events-icon.png')
const activityImage = require('../../assets/activity-icon.png')
const postsImage = require('../../assets/add.png')
import { useContext } from 'react'
import { COLORS } from '../../settings'
import { ZacButton } from '../../components/ZacButton'
import { UserContext } from '../../../contexts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackActions } from '@react-navigation/native'

const logout = async (navigation: any, setUser: Function) => {
	await AsyncStorage.setItem('username', '')
	navigation.dispatch(StackActions.replace('Login'))
	setUser(null)
}

export const HomeView = ({ navigation }: { navigation: any }) => {
	const { user, setUser } = useContext(UserContext)

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Image
					source={logoImage}
					style={{
						height: 40,
						width: 80,
						marginRight: 10,
					}}
				/>
				<Text style={styles.headerText}>Welcome, {user?.username}</Text>
			</View>
			<ZacButton onPress={() => logout(navigation, setUser)} text={'Logout'} color={'white'} />
			<ZacButton style={styles.loginButton} onPress={() => logout(navigation, setUser)} text={'Logout'} color={'white'} />
			<View style={styles.body}>
				<TouchableOpacity style={styles.clickSection} onPress={() => navigation.navigate('Settings')}>
					<Image
						source={settingsImage}
						style={{
							height: 40,
							width: 40,
							marginRight: 20,
						}}
					/>
					<Text style={styles.clickSectionText}></Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.clickSection} onPress={() => navigation.navigate('Events')}>
					<Image
						source={eventsImage}
						style={{
							height: 40,
							width: 40,
							marginRight: 20,
						}}
					/>
					<Text style={styles.clickSectionText}></Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.clickSection} onPress={() => navigation.navigate('Activities')}>
					<Image
						source={activityImage}
						style={{
							height: 40,
							width: 40,
							marginRight: 20,
						}}
					/>
					<Text style={styles.clickSectionText}></Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.clickSection} onPress={() => navigation.navigate('Activities')}>
					<Image
						source={activityImage}
						style={{
							height: 40,
							width: 40,
							marginRight: 20,
						}}
					/>
					<Text style={styles.clickSectionText}></Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.clickSection} onPress={() => navigation.navigate('Activities')}>
					<Image
						source={activityImage}
						style={{
							height: 40,
							width: 40,
							marginRight: 20,
						}}
					/>
					<Text style={styles.clickSectionText}></Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		margin: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	body:{
		margin: 575,
		borderRadius: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		width: '100%',
	},
	loginButton:{
		margin:20,
		borderRadius: 20,
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'flex-end',
	},
	headerText: {
		color: 'white',
		fontSize: 25,
		textAlign: 'left',
	},
	container: {
		flex: 1,
		backgroundColor: COLORS.green,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	clickSection: {
		backgroundColor: 'white',
		height: 50,
		margin: 20,
		flexDirection: 'row',
		padding: 10,
		borderRadius: 0,
		alignItems: 'center',
		justifyContent: 'center',
		aspectRatio: 1
	},
	clickSectionText: {
		color: 'black',
		fontSize: 25,
	},
})
