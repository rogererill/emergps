package upc.pxc.emergps;

import android.app.Activity;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Bundle;
import android.util.Log;
import android.view.*;

public class Error extends Activity {
	
	@Override
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		
		String err = getIntent().getStringExtra("ERROR");
		setContentView(new TextView(this, err));
	}
	
	static public class TextView extends View{
		String text;
		public TextView(Context context, String t){
			super(context);
			text = t;

		}
		
		@Override
		protected void onSizeChanged(int w, int h, int oldw, int oldh){
			ViewGroup.LayoutParams params = getLayoutParams();
			params.height = 70;
			params.width = 150;
			setLayoutParams(params);
			super.onSizeChanged(w, h, oldw, oldh);
		}

	    @Override
	    protected void onDraw(Canvas canvas) {
	          // Drawing commands go here    	   
			Paint tPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
			canvas.drawText(text, 10, 10, tPaint);
	    }
		
	}
	
}