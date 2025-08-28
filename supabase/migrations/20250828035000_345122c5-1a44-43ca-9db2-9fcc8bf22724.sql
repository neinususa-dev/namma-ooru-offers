-- Update the phone_exists function to check 10-digit phone numbers
CREATE OR REPLACE FUNCTION public.phone_exists(phone_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE phone_number = phone_to_check
  );
END;
$function$;