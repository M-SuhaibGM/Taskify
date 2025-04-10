import { currentUser } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'

const Protected = async () => {
    const {userId} = await auth()
    const user = await currentUser()
    return (
        <div> user:{user?.firstName}{userId}</div>
    )
}

export default Protected