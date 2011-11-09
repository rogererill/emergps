package upc.pxc.emergps;

import android.app.Activity;
import android.os.Bundle;
import android.view.*;
import android.view.View.OnClickListener;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.content.Intent;
import android.util.Log;

public class Report extends Activity {
	private Spinner spin;
	
	@Override
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		setContentView(R.layout.report);
		findViews();
		setAdapters();
		
	}
	
	private void findViews(){
		spin = (Spinner) findViewById(R.id.tipus_report);
		
		
	}
	
	private void setAdapters(){
		ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this, R.array.spin_report, android.R.layout.simple_spinner_item);
		adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
		spin.setAdapter(adapter);
	}
}