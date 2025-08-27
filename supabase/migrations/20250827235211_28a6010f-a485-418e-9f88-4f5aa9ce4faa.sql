-- Create reward profiles for existing users who don't have them yet
DO $$ 
DECLARE
    existing_user RECORD;
    new_referral_code TEXT;
BEGIN
    -- Loop through all existing users in profiles table who don't have reward records
    FOR existing_user IN 
        SELECT p.id, p.name, p.created_at
        FROM public.profiles p
        LEFT JOIN public.user_rewards ur ON p.id = ur.user_id
        WHERE ur.user_id IS NULL
    LOOP
        -- Generate unique referral code for existing user
        new_referral_code := public.generate_referral_code(existing_user.name);
        
        -- Create user rewards profile
        INSERT INTO public.user_rewards (
            user_id,
            referral_code,
            created_at,
            updated_at
        ) VALUES (
            existing_user.id,
            new_referral_code,
            existing_user.created_at,
            NOW()
        );
        
        -- Award registration bonus (50 points) to existing users
        PERFORM public.award_points(
            existing_user.id,
            50,
            'registration_bonus',
            'Welcome bonus for existing member!'
        );
        
        RAISE NOTICE 'Created rewards profile for user: %', existing_user.name;
    END LOOP;
END $$;