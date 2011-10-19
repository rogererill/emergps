package upc.pxc.emergps;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.*;
import android.view.View.OnClickListener;
import android.content.Intent;
import android.util.Log;

public class Menu extends Activity implements OnClickListener{
	@Override
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		
		View b_report = findViewById(R.id.report_label);
		b_report.setOnClickListener(this);
		View b_incid = findViewById(R.id.incid_label);
		b_incid.setOnClickListener(this);
		View b_log = findViewById(R.id.log_label);
		b_log.setOnClickListener(this);
		View b_exit = findViewById(R.id.exit_label);
		b_exit.setOnClickListener(this);
		
	}

	@Override
	public void onClick(View v) {
		Intent i;
		switch(v.getId()){
		case(R.id.report_label):
			i = new Intent(this, Report.class);
			startActivity(i);
		break;
		case(R.id.incid_label):
			i = new Intent(this, Incidence.class);
			startActivity(i);
		break;
		case(R.id.log_label):
			i = new Intent(this, Logs.class);
			startActivity(i);	
		break;
		case(R.id.exit_label):
			finish();
		break;
		}
		
	}

	
}