import { Loader, useMantineTheme } from "@mantine/core"
import classes from './Spinner.module.css'

const Spinner = ()=>{
    const theme = useMantineTheme();
    return (
        <Loader color={theme.primaryColor} className={classes.spinner}/>
    )
}
export default Spinner