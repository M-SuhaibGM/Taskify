import { OrganizationProfile } from '@clerk/nextjs'

const SettingPge = () => {
    return (
        <div className='w-full   '>
            <OrganizationProfile
             routing="hash"
                appearance={{
                    elements: {
                        rootBox: {
                            boxShadow: "none",
                            width: "100%",
                            height: "80vh",
                            overflowY: "hidden",
                        },
                        card: {
                            border: "1px solid #e5e5e5 ",
                            boxShadow: "none",
                            width: "100%",

                        }
                    }
                }}
            />

        </div>
    )
}

export default SettingPge