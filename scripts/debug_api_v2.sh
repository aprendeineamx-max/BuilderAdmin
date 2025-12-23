ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE"

echo "--- Testing Direct Localhost:8000 (Correct Key) ---"
curl -v "http://127.0.0.1:8000/rest/v1/clases_generadas?select=id&limit=1" \
  -H "apikey: $ANON" \
  -H "Authorization: Bearer $ANON"

echo "\n\n--- Testing Public Domain via Nginx (Correct Key) ---"
curl -k -v "https://inea.mx/supabase/rest/v1/clases_generadas?select=id&limit=1" \
  -H "apikey: $ANON" \
  -H "Authorization: Bearer $ANON"
