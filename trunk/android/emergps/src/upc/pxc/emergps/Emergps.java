package upc.pxc.emergps;

import android.app.Activity;
import android.os.Bundle;
import android.widget.*;
import android.view.*;
import android.view.View.OnClickListener;
import android.content.Intent;
import android.util.Log;

public class Emergps extends Activity implements OnClickListener{
    /** Called when the activity is first created. */
	EditText tu, tp;
	Button login;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.autent);
        
        tu = (EditText) findViewById(R.id.text_user);
        tp = (EditText) findViewById(R.id.text_pass);
        login = (Button) findViewById(R.id.login_button);
        login.setOnClickListener(this);
       
    }
    
    public void onClick(View v){
    	String stu = tu.getText().toString();
    	String stp = tp.getText().toString();
    	final String TAG = "Autenticació";
    	
    	if(/*userOk(stu, stp)*/true){
    		Log.d(TAG, "OK!");
			Intent i = new Intent(this, Menu.class);
			startActivity(i);
			finish();
			
    	} else {
    		Log.d(TAG, "OUT!");
    		Intent i = new Intent(this, Error.class);
    		
    		String err = getResources().getString(R.string.error_login);
    		i.putExtra("ERROR", err);
    		startActivity(i);
    	}
    }
    
    private boolean userOk(String login, String pass){		// Implementar comunicació
    	if(login.equals("a") && pass.equals("a"))	return true;
    	return false;
    }
    
    
    
    
    
    
    
    
    
    
    
    
}