"use client"
import { redirect, useParams } from "next/navigation"
import BDPartnerTypeSelection from "../bd-patner/page";
import RegisterFormPage from "../form";

// Type definitions
type Role = 'company' | 'bd-partner';
type ProfileType = '' | 'individual' | 'company';

export default function RegisterPage() {
    const params = useParams()
    const route = params.type;

    const validRoutes = [
        { role: 'company', profileType: '' },
        { role: 'bd-partner', profileType: '' },
        { role: 'bd-partner', profileType: 'individual' },
        { role: 'bd-partner', profileType: 'company' },
    ];

    if (route?.length == 1 && (route[0] === 'bd-partner')) {
        return <BDPartnerTypeSelection />
    }

    const matchedRoute = validRoutes.find(r => {
        if (r.profileType) {
            return route?.length === 2 && r.role === route[0] && r.profileType === route[1];
        } else {
            return route?.length === 1 && r.role === route[0];
        }
    });

    if (!matchedRoute) {
        redirect('/register');
    }

    const { role, profileType } = matchedRoute;

    // Render the full registration form page with props
    return <RegisterFormPage role={role as Role} profileType={profileType as ProfileType} />
}
