import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import SelectListScreen from '../Screens/SelectListScreen';
import StartScreen from '../Screens/StartScreen';
import CreateEditListScreen from '../Screens/CreateEditListScreen';
import ResultScreen from '../Screens/ResultScreen';

const defaultNavOptions = {
    headerTitle: '',
    headerTintColor: '#fff',
    headerStyle: {
        backgroundColor: '#000',
    },
    headerTitleStyle:{
        color: '#fff'
    },
    
}


const listNavigator = createStackNavigator({

    Start: StartScreen,
    SelectList: SelectListScreen,
    CreateEdit: CreateEditListScreen,
    Result: ResultScreen

},
    {
        defaultNavigationOptions:{
            ...defaultNavOptions
        },
        headerMode: "float"
    }
);

export default createAppContainer(listNavigator)