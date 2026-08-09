import './App.css'
import AuthProvider from "./auth/auth-provider.tsx";
import {Routes} from "./router/router.tsx";

function App() {

    return (
        <>
            <AuthProvider>
                <Routes/>
            </AuthProvider>
        </>
    )
}

export default App;
