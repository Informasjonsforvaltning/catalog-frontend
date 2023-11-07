import { redirect } from 'next/navigation';

const App = async () => {
  redirect(`${process.env.FDK_REGISTRATION_BASE_URI}`);
};

export default App;
